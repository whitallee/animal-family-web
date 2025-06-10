import { unstable_ViewTransition as ViewTransition } from 'react'

export default function TasksPage() {
    return (
        <ViewTransition name="tasks">
            <div className="h-[calc(100vh-4rem)] w-screen flex items-center justify-center bg-stone-500 rounded-lg">Tasks</div>
        </ViewTransition>
    );
}