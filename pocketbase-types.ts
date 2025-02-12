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
	Bookings = "bookings",
	Comments = "comments",
	Employees = "employees",
	Hotels = "hotels",
	Reviews = "reviews",
	RoomTypes = "room_types",
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

export type BookingsRecord = {
	cancelled?: boolean
	check_in?: IsoDateString
	check_out?: IsoDateString
	created?: IsoDateString
	guests?: number
	hotel?: RecordIdString
	id: string
	room?: RecordIdString[]
	total_price?: number
	updated?: IsoDateString
	user?: RecordIdString
}

export type CommentsRecord = {
	author_id?: RecordIdString
	content?: HTMLString
	created?: IsoDateString
	dislike_count?: number
	entertainment_rating?: number
	food_rating?: number
	hotel_id?: RecordIdString
	id: string
	like_count?: number
	overall_rating?: number
	parent_id?: RecordIdString
	read?: boolean
	room_rating?: number
	service_rating?: number
	updated?: IsoDateString
}

export type EmployeesRecord = {
	created?: IsoDateString
	hotel_id?: RecordIdString
	id: string
	name?: string
	phone_number?: string
	role?: string
	subordinate?: RecordIdString[]
	superior?: RecordIdString
	updated?: IsoDateString
	user?: RecordIdString
	wage?: number
}

export type HotelsRecord = {
	created?: IsoDateString
	id: string
	long_description?: HTMLString
	name?: string
	owner_id?: RecordIdString
	photos?: string[]
	rating?: number
	short_description?: HTMLString
	thumbnail?: string
	updated?: IsoDateString
}

export type ReviewsRecord = {
	content?: HTMLString
	created?: IsoDateString
	entertainment_rating: number
	food_rating: number
	hotel_id?: RecordIdString
	id: string
	overall_rating: number
	room_rating: number
	service_rating: number
	updated?: IsoDateString
	user_id?: RecordIdString
}

export enum RoomTypesRoomTypeOptions {
	"Standard" = "Standard",
	"VIP" = "VIP",
	"VIP Deluxe" = "VIP Deluxe",
	"Double" = "Double",
	"VIP ULTRA LUXE" = "VIP ULTRA LUXE",
}
export type RoomTypesRecord = {
	capacity?: number
	created?: IsoDateString
	extra_info?: HTMLString
	features?: HTMLString
	hotel?: RecordIdString
	id: string
	photos?: string[]
	price?: number
	room?: RecordIdString[]
	room_type?: RoomTypesRoomTypeOptions
	updated?: IsoDateString
}

export type RoomsRecord = {
	available?: boolean
	created?: IsoDateString
	hotel?: RecordIdString
	id: string
	room_type?: RecordIdString
	thumbnail?: string
	updated?: IsoDateString
}

export enum UsersRoleOptions {
	"Customer" = "Customer",
	"Employee" = "Employee",
	"Admin" = "Admin",
}
export type UsersRecord = {
	avatar?: string
	created?: IsoDateString
	disliked_comments?: RecordIdString[]
	email: string
	emailVisibility?: boolean
	id: string
	liked_comments?: RecordIdString[]
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
export type BookingsResponse<Texpand = unknown> = Required<BookingsRecord> & BaseSystemFields<Texpand>
export type CommentsResponse<Texpand = unknown> = Required<CommentsRecord> & BaseSystemFields<Texpand>
export type EmployeesResponse<Texpand = unknown> = Required<EmployeesRecord> & BaseSystemFields<Texpand>
export type HotelsResponse<Texpand = unknown> = Required<HotelsRecord> & BaseSystemFields<Texpand>
export type ReviewsResponse<Texpand = unknown> = Required<ReviewsRecord> & BaseSystemFields<Texpand>
export type RoomTypesResponse<Texpand = unknown> = Required<RoomTypesRecord> & BaseSystemFields<Texpand>
export type RoomsResponse<Texpand = unknown> = Required<RoomsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	bookings: BookingsRecord
	comments: CommentsRecord
	employees: EmployeesRecord
	hotels: HotelsRecord
	reviews: ReviewsRecord
	room_types: RoomTypesRecord
	rooms: RoomsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	bookings: BookingsResponse
	comments: CommentsResponse
	employees: EmployeesResponse
	hotels: HotelsResponse
	reviews: ReviewsResponse
	room_types: RoomTypesResponse
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
	collection(idOrName: 'bookings'): RecordService<BookingsResponse>
	collection(idOrName: 'comments'): RecordService<CommentsResponse>
	collection(idOrName: 'employees'): RecordService<EmployeesResponse>
	collection(idOrName: 'hotels'): RecordService<HotelsResponse>
	collection(idOrName: 'reviews'): RecordService<ReviewsResponse>
	collection(idOrName: 'room_types'): RecordService<RoomTypesResponse>
	collection(idOrName: 'rooms'): RecordService<RoomsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
