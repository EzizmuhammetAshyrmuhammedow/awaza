/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	Comments = "comments",
	Hotels = "hotels",
	Rooms = "rooms",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type CommentsRecord = {
	author_id?: RecordIdString
	content?: HTMLString
	created?: IsoDateString
	hotel_id?: RecordIdString
	id: string
	updated?: IsoDateString
}

export type HotelsRecord = {
	created?: IsoDateString
	id: string
	long_description?: HTMLString
	name?: string
	owner_id?: RecordIdString
	photos?: string[]
	short_description?: HTMLString
	thumbnail?: string
	updated?: IsoDateString
}

export enum RoomsRoomTypeOptions {
	"Standart" = "Standart",
	"Masgala" = "Masgala",
	"VIP" = "VIP",
}
export type RoomsRecord = {
	created?: IsoDateString
	hotel?: RecordIdString
	id: string
	room_type?: RoomsRoomTypeOptions
	thumbnail?: string
	updated?: IsoDateString
}

export enum UsersRoleOptions {
	"Customer" = "Customer",
	"Worker" = "Worker",
	"Admin" = "Admin",
}
export type UsersRecord = {
	avatar?: string
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	name?: string
	password: string
	role?: UsersRoleOptions
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type CommentsResponse<Texpand = unknown> = Required<CommentsRecord> & BaseSystemFields<Texpand>
export type HotelsResponse<Texpand = unknown> = Required<HotelsRecord> & BaseSystemFields<Texpand>
export type RoomsResponse<Texpand = unknown> = Required<RoomsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	comments: CommentsRecord
	hotels: HotelsRecord
	rooms: RoomsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	comments: CommentsResponse
	hotels: HotelsResponse
	rooms: RoomsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'comments'): RecordService<CommentsResponse>
	collection(idOrName: 'hotels'): RecordService<HotelsResponse>
	collection(idOrName: 'rooms'): RecordService<RoomsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
