import { hasOwnProperty } from "@m-cafe-app/utils";
import { JwtPayload } from "jsonwebtoken";

export interface JwtPayloadCustom extends JwtPayload {
  id: string;
}

export const isCustomPayload = (payload: JwtPayload): payload is JwtPayloadCustom =>
  hasOwnProperty(payload, "id");