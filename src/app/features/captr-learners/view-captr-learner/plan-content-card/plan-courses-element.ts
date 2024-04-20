export interface StartedCourses {
    count: number;
    date: Date;
    title: string;
    selected?: boolean;
    accredited?: boolean;
    nonaccredited?: boolean;
    bothCourses?: boolean;
    courses?: any[]
}

export interface CompletedCourses {
    count: number;
    date: Date;
    title: string;
    selected?: boolean;
    accredited?: boolean;
    nonaccredited?: boolean;
    bothCourses?: boolean;
}
