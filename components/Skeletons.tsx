import { SubjectCircle } from "./SubjectSection"

export function ShortTaskItemSkeleton() {
    return (
        <div className="flex items-center gap-2">
            <div className="w-6 h-6 aspect-square bg-stone-900 rounded-full animate-pulse" />
            <div className="w-full h-4 bg-stone-900 rounded-full animate-pulse" />
        </div>
    )
}

export function ShortTaskListSkeleton() {
    return (
        <>
            <ShortTaskItemSkeleton />
            <ShortTaskItemSkeleton />
            <ShortTaskItemSkeleton />
        </>
    )
}

export function SubjectSkeletonList() {
    return (
        <>
            <SubjectCircle className="animate-pulse" />
            <SubjectCircle className="animate-pulse" />
            <SubjectCircle className="animate-pulse" />
            <SubjectCircle shift={true} className="animate-pulse" />
            <SubjectCircle shift={true} className="animate-pulse" />
            <SubjectCircle shift={true} placeholder={true} />
            {/* repeat this pattern in a map */}
            <SubjectCircle className="animate-pulse" />
            <SubjectCircle className="animate-pulse" />
            <SubjectCircle className="animate-pulse" />
            <SubjectCircle shift={true} className="animate-pulse" />
            <SubjectCircle shift={true} className="animate-pulse" />
            <SubjectCircle shift={true} placeholder={true} />
        </>
    )
}

export function TaskItemSkeleton() {
    return (
        <div className="flex items-center gap-4 w-full">
            <div className="w-6 h-6 aspect-square bg-stone-900 rounded-full animate-pulse" />
            <div className="w-full h-4 bg-stone-900 rounded-full animate-pulse" />
        </div>
    )
}

export function TaskListSkeleton() {
    return (
        <>
            <TaskItemSkeleton />
            <TaskItemSkeleton />
            <TaskItemSkeleton />
            <TaskItemSkeleton />
            <TaskItemSkeleton />
            <TaskItemSkeleton />
        </>
    )
}

export function FamilyItemSkeleton() {
    return (
        <div className="flex items-center gap-4 w-full">
            <div className="w-20 h-20 aspect-square bg-stone-900 rounded-full animate-pulse" />
            <div className="flex flex-col gap-4 w-full">
                <div className="w-full h-4 bg-stone-900 rounded-full animate-pulse" />
                <div className="w-2/3 h-4 bg-stone-900 rounded-full animate-pulse" />
            </div>
        </div>
    )
}

export function FamilyListSkeleton() {
    return (
        <>
            <FamilyItemSkeleton />
            <FamilyItemSkeleton />
            <FamilyItemSkeleton />
            <FamilyItemSkeleton />
            <FamilyItemSkeleton />
        </>
    )
}