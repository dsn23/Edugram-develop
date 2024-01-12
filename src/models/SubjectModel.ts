export interface SubjectModel {
    _id: string;
    familly_id: string;
    parent_id: string;
    lang_group_id: string;
    name: string;
    label: string;
    dative: string;
    trending: boolean;
    ads_count: string;
    aliases: any[][];
    related: Related;
}
export interface Category {
    id: string;
}

export interface Proceedings {
    id: string;
    name: string;
}

export interface Related {
    category: Category;
    subjects: any[];
    proceedings: Proceedings[];
}
