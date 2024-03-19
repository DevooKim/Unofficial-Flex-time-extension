type DotIconProps = React.SVGProps<SVGSVGElement>

const DotIcon = (props: DotIconProps) => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="black"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <circle cx="8" cy="8" r="4" />
    </svg>
)

export default DotIcon
