/**
 * FileCustom.tsx
 *
 * Purpose:
 * Renders a stylized custom file input button.
 *
 * Responsibilities:
 * - Wrap a hidden HTML file input field
 * - Trigger change events when user uploads files
 * - Display attachment icon (Paperclip)
 *
 * Dependencies:
 * - Lucide Paperclip icon
 */

import React from "react";
import { Paperclip } from "lucide-react";

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
                    <Paperclip className="icon-md" />
                </label>
            </div>
        </div>
    );
}

export default ImageCustom;
