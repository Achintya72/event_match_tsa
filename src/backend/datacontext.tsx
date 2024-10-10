"use client";

import { CompEvent } from "@/types/event";
import { Student } from "@/types/student";
import { Team } from "@/types/team";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { createContext, PropsWithChildren, useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Loader from "@/components/loader";

interface Data {
    students: Student[] | null,
    events: CompEvent[] | null,
    teams: Team[] | null,
    authUser: User | null,
    loggedIn: boolean | null,
    loading: boolean,
};

const DataContext = createContext<Data>({
    students: [],
    events: [],
    teams: [],
    authUser: null,
    loggedIn: null,
    loading: false,
});

const DataContextProvider = ({ children }: PropsWithChildren) => {
    const [students, changeStudents] = useState<Student[] | null>(null);
    const [events, changeEvents] = useState<CompEvent[] | null>(null);
    const [teams, changeTeams] = useState<Team[] | null>(null);
    const [authUser, changeAuthUser] = useState<User | null>(null);
    const [loggedIn, changeLoggedIn] = useState<boolean | null>(null);
    const [loading, changeLoading] = useState(true);

    useEffect(() => {
        let callback = onAuthStateChanged(auth, (user) => {
            if (user) {
                changeAuthUser(user);
                changeLoggedIn(true);
            } else {
                changeAuthUser(null);
                changeLoggedIn(false);
            }
        })
        return callback;
    }, []);

    useEffect(() => {
        const getStudents = () => {
            let unsub = onSnapshot(collection(db, "students"), (data) => {
                let newStudents: Student[] = [];
                data.docs.forEach(doc => {
                    newStudents.push({ ...doc.data(), uid: doc.id } as Student);
                });
                changeStudents(newStudents);
            });
            return unsub;
        }

        const getEvents = () => {
            let unsub = onSnapshot(collection(db, "Events"), (data) => {
                let newEvents: CompEvent[] = [];
                data.docs.forEach(doc => {
                    newEvents.push({ ...doc.data(), id: doc.id } as CompEvent);
                })
                changeEvents(newEvents);

            })
            return unsub;
        }

        const getTeams = () => {
            let unsub = onSnapshot(collection(db, "teams"), data => {
                let newTeams: Team[] = [];
                data.docs.forEach(doc => {
                    newTeams.push({ ...doc.data(), id: doc.id } as Team);
                })
                changeTeams(newTeams);
            });
            return unsub;
        }

        if (auth) {
            let stuUnsub = getStudents();
            let eveUnsub = getEvents();
            let teamUnsub = getTeams();
            return () => {
                stuUnsub();
                eveUnsub();
                teamUnsub();
            }
        } else {
            changeStudents([]);
            changeEvents([]);
            changeTeams([]);
        } 
    }, [auth, loggedIn, changeStudents, changeEvents, changeTeams]);

    useEffect(() => {
        if (loggedIn != null && students != null && events != null && teams != null) {
            changeLoading(false);
        }
    }, [auth, students, events, teams]);

    const value: Data = {
        students,
        events,
        teams,
        authUser,
        loggedIn,
        loading
    };

    if (loading) {
        return <Loader />
    }

    return (
        <DataContext.Provider value={value}>{children}</DataContext.Provider>
    )
}

export {
    DataContext as default,
    DataContextProvider
}