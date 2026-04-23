import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest){
    const { searchParams } = request.nextUrl

    const limit = searchParams.get("limit") ?? "20"
    const offset = searchParams.get("offset") ?? "0"
    const categoryId = searchParams.get("categoryId")
    const title = searchParams.get("title")

    if (isNaN(Number(limit)) || isNaN(Number(offset))){
        return NextResponse.json(
            { error: "Invalid parameters"},
            {status: 400}
        )
    }

    const url = new URL("https://api.escuelajs.co/api/v1/products")
    url.searchParams.set("limit", String(Math.min(Number(limit), 100)))
    url.searchParams.set("offset", offset)

    if(categoryId){url.searchParams.set("categoryId",categoryId)}
    if(title){url.searchParams.set("title",title)}

    try {
        const response = await fetch(url.toString())

        if(!response.ok){return NextResponse.json(
            {error: "Failed to fetch products!"},
            {status: 502}
        )}

        const data = await response.json()

        const products = data.map((p: {
            id: number;
            title: string;
            price: number;
            description: string;
            category: { id: number; name: string };
            images: string[];
        }) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            description: p.description,
            category: p.category,
            images: p.images,
        }));

    return NextResponse.json(products);

    } catch (error) {
        return NextResponse.json(
            {error: "Internal server error!"},
            {status: 500}
        )
    }
}