export default function SubjectCircle({ shift, placeholder }: { shift: boolean, placeholder: boolean }) {
    return (
        <div className={`bg-stone-700 rounded-full aspect-square flex items-center justify-center ${shift ? "translate-x-[calc(50%+8px)]" : ""} ${placeholder ? "opacity-0" : ""}`}>
            <p className="text-white"></p>
        </div>
    )
}