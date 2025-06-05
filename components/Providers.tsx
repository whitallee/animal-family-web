"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { AuthProvider } from "@/lib/AuthContext";

export default function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </AuthProvider>
    );
}