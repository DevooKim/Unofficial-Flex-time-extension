type DownloadIconProps = React.SVGProps<SVGSVGElement>

const DownloadIcon = (props: DownloadIconProps) => (
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
            d="M13.5 6.25H11V2H5V6.25H2.5L8 12.25L13.5 6.25ZM2.5 14.5H13.5V13.2H2.5V14.5Z"
        />
    </svg>
)

export default DownloadIcon
