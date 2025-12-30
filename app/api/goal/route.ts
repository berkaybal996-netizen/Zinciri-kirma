import { connectDB } from "@/lib/db"
import Goal from "@/app/models/Goal" // 🔥 default import
export async function GET() {
    try {
        await connectDB()
        const goals = await Goal.find().sort({ createdAt: -1 })

        return new Response(JSON.stringify({ goals }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        })
    } catch (error) {
        console.error("GET ERROR:", error)
        return new Response(
            JSON.stringify({ error: "Goals alınamadı" }),
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        await connectDB()
        const body = await request.json()
            
        const goal = await Goal.create(body)

        return new Response(JSON.stringify({ goal }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        })
    } catch (error) {
        console.error("POST ERROR:", error)
        return new Response(
            JSON.stringify({ error: "Goal kaydedilemedi" }),
            { status: 500 }
        )
    }
}