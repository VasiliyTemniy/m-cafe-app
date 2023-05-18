import { JwtPayload } from "jsonwebtoken"

export interface JwtPayloadCustom extends JwtPayload {
  id?: string;
}

export const isCustomPayload = (payload: JwtPayload): payload is JwtPayloadCustom =>
Object.prototype.hasOwnProperty.call(payload, "id");