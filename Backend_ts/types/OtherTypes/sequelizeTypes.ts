import { Col, Fn, Literal, MakeNullishOptional } from 'sequelize/types/utils';
import { Attributes, Model, ModelStatic, DestroyOptions, InstanceDestroyOptions, CreateOptions, InstanceUpdateOptions, NonNullFindOptions, FindOptions, UpdateOptions, FindOrCreateOptions, Identifier, BulkCreateOptions } from 'sequelize/types';
import { Models } from "../baseTypes";


export interface UpdateType<T extends Model<any, any> = Models> {
    values: { [key in keyof Attributes<T>]?: Fn | Col | Literal | Attributes<T>[key] | undefined },
    searchTerm: Omit<UpdateOptions<Attributes<T>>, "returning">
}

export interface FindOneType<T extends Model<any, any> = Models> {
    options?: NonNullFindOptions<Attributes<T>>
}

export interface FindOrCreateType<T extends Model<any, any> = Models> {
    options: FindOrCreateOptions<Attributes<T>, MakeNullishOptional<T["_creationAttributes"]>>
}

export interface FindAllType<T extends Model<any, any> = Models> {
    options?: NonNullFindOptions<Attributes<T>>
}

export interface DestroyType<T extends Model<any, any> = Models> {
    options: DestroyOptions<Attributes<T>> | undefined
}

export interface CreateType<T extends Model<any, any> = Models> {
    options: Attributes<T>
}

export interface BulkCreateType<T extends Model<any, any> = Models> {
    records: readonly MakeNullishOptional<T["_creationAttributes"]>[],
    options?: BulkCreateOptions<Attributes<T>>
}


