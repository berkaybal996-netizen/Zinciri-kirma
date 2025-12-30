"use client"

import React, { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"

 


const months = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
]

const years = Array.from({ length: 5 }, (_, i) =>
    String(new Date().getFullYear() + i)
)

 

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Ad en az 2 karakter olmalı",
    }),
    goal: z.string().min(3, {
        message: "Hedef en az 3 karakter olmalı",
    }),
    month: z.string({
        required_error: "Ay seçiniz",
    }),
    year: z.string({
        required_error: "Yıl seçiniz",
    }),
})

 
type Goal = {
    userId: { type: String, required: true },
    _id: string
    username: string
    goal: string
    month: string
    year: string
}
const GoalPage = () => {


    const [goals, setGoals] = useState<Goal[]>([])

    const fetchGoals = async () => {
        const res = await fetch("/api/goal")

        if (!res.ok) {
            throw new Error("Goal listesi alınamadı")
        }

        const data = await res.json()
        setGoals(data.goals)
    }

    useEffect(() => {
        fetchGoals()
    }, [])


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            goal: "",
            month: "",
            year: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const res = await fetch("/api/goal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })

        console.log("STATUS:", res.status)

        const text = await res.text()
        console.log("RESPONSE BODY:", text)

        if (!res.ok) {
            throw new Error("Goal eklenemedi")
        }

        await fetchGoals()
    }



    return (
        <div className="container mx-auto max-w-xl pt-10">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* Ad Soyad */}
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ad Soyad</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ad Soyad" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Hedef */}
                    <FormField
                        control={form.control}
                        name="goal"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hedefiniz</FormLabel>
                                <FormControl>
                                    <Input placeholder="Örn: 10 kilo vermek" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Ay */}
                    <FormField
                        control={form.control}
                        name="month"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hedeflenen Ay</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Ay seçin" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {months.map((month) => (
                                            <SelectItem key={month} value={month}>
                                                {month}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Yıl */}
                    <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hedeflenen Yıl</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Yıl seçin" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {years.map((year) => (
                                            <SelectItem key={year} value={year}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">
                        Hedef Ekle
                    </Button>

                </form>
            </Form>

            <div className="mt-10 space-y-4">
                <h2 className="text-xl font-semibold">Eklenen Hedefler</h2>

                {goals.length === 0 && (
                    <p className="text-muted-foreground">Henüz hedef eklenmedi</p>
                )}

                {goals.map((goal) => (
                    <div
                        key={goal._id}
                        className="rounded-lg border p-4"
                    >
                        <p className="font-medium">{goal.goal}</p>
                        <p className="text-sm text-muted-foreground">
                            {goal.username} · {goal.month} {goal.year}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GoalPage
