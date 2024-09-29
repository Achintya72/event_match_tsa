interface Student {
    name: string,
    grade: 9 | 10 | 11 | 12,
    email: string,
    uid: string,
    priorQuals: Qual[],
    teams: string[],
}

interface Qual {
    eventName: string,
    level: "National" | "State",
    placement: number
}

export type {
    Student,
    Qual
}