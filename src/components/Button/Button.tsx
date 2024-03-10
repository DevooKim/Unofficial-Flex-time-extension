export type ButtonProps = React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> & {
    children?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
    className,
    children,
    ...props
}: ButtonProps) => (
    <button className={className} {...props}>
        {children}
    </button>
)

export default Button
