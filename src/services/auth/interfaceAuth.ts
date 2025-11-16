export type LoginRequest = {
	email: string
	password: string
}

export type LoginResponse = {
	token: string
}

export type RegisterRequest = {
	email: string
	username: string
	password: string
	role?: string
	department?: string | null
}

export type RegisterResponse = {
	message: string
	userId: string
}

export type UserInfo = {
	username?: string
	email: string
	name?: string
	role?: string | null
	department?: string | null
}
