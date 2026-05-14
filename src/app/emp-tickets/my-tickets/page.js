"use client";

import MyTickets from "@/components/ticket/empTicketsComp/MyTickets";
import { Suspense } from 'react';

export default function MyTicketsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MyTickets />
        </Suspense>
    );
}