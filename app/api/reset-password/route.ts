import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ResetPasswordSchema } from "@/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = ResetPasswordSchema.parse(body);

    const existingUserByEmail = await db.user.findUnique({
      where: { email },
    });

    if (!existingUserByEmail) {
      return NextResponse.json(
        {
          type: "warn",
          user: null,
          message: "User with this email does not exists",
          success: false,
        },
        {
          status: 400, //client error
        }
      );
    }

    const hashedPassword = await hash(password, 12);

    const newUser = await db.user.create({
      data: {
        name,
        email,
        username,
        password: hashedPassword,
      },
    });

    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json(
      {
        type: "success",
        user: rest,
        message: "New account created successfully",
        success: true,
      },
      {
        status: 201, //account created successfully
      }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        type: "error",
        message: error.message,
        success: false,
      },
      {
        status: 500, //server side error
      }
    );
  }
}
