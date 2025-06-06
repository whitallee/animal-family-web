import SubjectCircle from "./SubjectCircle";

export default function SubjectSection() {
    return (
        <div className="grid max-w-md my-6 grid-cols-3 w-full content-center gap-x-4 gap-y-0 overflow-y-scroll overflow-x-hidden">
            <SubjectCircle shift={false} placeholder={false} />
            <SubjectCircle shift={false} placeholder={false} />
            <SubjectCircle shift={false} placeholder={false} />
            <SubjectCircle shift={true} placeholder={false} />
            <SubjectCircle shift={true} placeholder={false} />
            <SubjectCircle shift={true} placeholder={true} />
            {/* repeat this pattern in a map */}
            <SubjectCircle shift={false} placeholder={false} />
            <SubjectCircle shift={false} placeholder={false} />
            <SubjectCircle shift={false} placeholder={false} />
            <SubjectCircle shift={true} placeholder={false} />
            <SubjectCircle shift={true} placeholder={false} />
            <SubjectCircle shift={true} placeholder={true} />
            {/* repeat this pattern in a map */}
            <SubjectCircle shift={false} placeholder={false} />
            <SubjectCircle shift={false} placeholder={false} />
            {/* <SubjectCircle shift={false} placeholder={false} />
            <SubjectCircle shift={true} placeholder={false} />
            <SubjectCircle shift={true} placeholder={false} />
            <SubjectCircle shift={true} placeholder={true} /> */}
        </div>
    )
}