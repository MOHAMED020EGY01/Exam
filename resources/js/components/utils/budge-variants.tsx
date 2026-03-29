import { Badge } from "@/components/ui/badge"
interface Props{
    variant?: "default" | "secondary" | "destructive" | "outline" | "ghost"
    children?: React.ReactNode
}
const BadgeVariants = ({variant = "default", children}:Props) =>{
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant={variant}>{children}</Badge>
    </div>
  )
}
export {BadgeVariants}