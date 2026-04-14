import { Paperclip, Trash2 } from "lucide-react";
interface Props {
    name: string;
    id: string;
    action: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
function ImageCustom({ name, id, action }: Props) {
    return (
        <div>
            <div>
                <input
                    type="file"
                    name={name}
                    id={id}
                    className="hidden"
                    onChange={action}
                />
                <label htmlFor={id} className="cursor-pointer">
                    <Paperclip className="w-5 h-5" />
                </label>
            </div>
        </div>
    );
}

export default ImageCustom;
