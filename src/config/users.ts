export interface UserConfig {
    id: number;
    email: string;
    password: string;
    name: string;
    role: "admin" | "customer";
    avatar: string;
    creationAt?: string;
    updatedAt?: string;
}

export const users: UserConfig[] = [
    {"id":1,"email":"john@mail.com","password":"changeme","name":"Jhon","role":"customer","avatar":"https://i.imgur.com/LDOO4Qs.jpg","creationAt":"2026-01-29T12:45:44.000Z","updatedAt":"2026-01-29T12:45:44.000Z"},
    {"id":2,"email":"maria@mail.com","password":"12345","name":"Maria","role":"customer","avatar":"https://i.imgur.com/DTfowdu.jpg","creationAt":"2026-01-29T12:45:44.000Z","updatedAt":"2026-01-29T12:45:44.000Z"},
    {"id":3,"email":"admin@mail.com","password":"admin123","name":"Admin","role":"admin","avatar":"https://i.imgur.com/yhW6Yw1.jpg","creationAt":"2026-01-29T12:45:44.000Z","updatedAt":"2026-01-29T12:45:44.000Z"}
];