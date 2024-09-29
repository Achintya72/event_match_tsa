interface CompEvent {
    id: string,
    name: string,
    minMembers: number,
    maxMembers: number,
    maxTeams: number,
    teams: string[]
}

export type {
    CompEvent
}