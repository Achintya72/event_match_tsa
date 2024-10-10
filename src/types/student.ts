interface Student {
    name: string,
    grade: 9 | 10 | 11 | 12,
    email: string,
    uid: string,
    priorQuals: Qual[],
    teams: string[],
    onboarded: boolean
}

interface Qual extends Option {
    level: "National" | "State",
    placement: number,
    eventId: string,
}

interface Option {
    name: string,
    id: string
}

export type {
    Student,
    Qual,
    Option
}