import { NextResponse } from "next/server"
import { register, Counter, Histogram, collectDefaultMetrics } from "prom-client";

collectDefaultMetrics()

export const loginCounter = new Counter({
    name: "auth_login_total",
    help: "Total login attempts",
    labelNames: ["username", "status"],
})

export const httpRequestDuration = new Histogram({
    name: "http_request_duration_seconds",
    help: "HTTP request duration",
    labelNames: ["path", "method", "status"],
})

export async function GET(){
    const metrics = await register.metrics()
    return new NextResponse(metrics, {
        headers: {
            "Content-Type": "text/plain",
        }
    })
}