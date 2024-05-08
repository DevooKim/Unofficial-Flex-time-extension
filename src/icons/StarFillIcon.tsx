type StarFillIconProps = React.SVGProps<SVGSVGElement>

const StarFillIcon = (props: StarFillIconProps) => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 1.24121L10.055 5.77321L15 6.32721L11.325 9.68221L12.326 14.5562L8 12.0972L3.674 14.5562L4.675 9.68221L1 6.32721L5.945 5.77321L8 1.24121Z"
        />
    </svg>
)

export default StarFillIcon
