"use client";
import { useEffect } from "react";

export default function SocketProvider() {
    useEffect(() => {
        fetch("/api/socket");
    }, []);

    return null;
}
