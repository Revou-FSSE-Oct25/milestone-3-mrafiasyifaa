import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    try {
        const header = request.headers.get("Authorization")

    if( !header|| !header.startsWith("Bearer ")){
        return NextResponse.json(
            {error: "Invalid authorization headers!"},
            {status: 401}
        )
    }

    const response = await fetch('https://api.escuelajs.co/api/v1/auth/profile',{
        method: "GET",
        headers: {
            "Authorization": header
        }
    })

    if(!response.ok){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await response.json()

    const filteredData = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        avatar: data.avatar
    }

    return NextResponse.json({success: true, user: filteredData})
    } catch (error) {
        console.log("Proxy error:", error)
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}