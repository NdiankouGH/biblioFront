"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

const AddDialog = ({ titleButton, description, children }) => (
    <Dialog.Root>
        <Dialog.Trigger asChild>
            <button className="bg-violet-600 text-white px-4 h-[35px] rounded-md font-medium hover:bg-violet-700 transition-colors">
                {titleButton}
            </button>
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
            <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg max-h-[80vh] overflow-y-auto">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                    {titleButton}
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-gray-500">
                    {description}
                </Dialog.Description>

                <div className="mt-4">{children}</div>



                <Dialog.Close asChild>
                    <button
                        className="absolute top-3 right-3 inline-flex items-center justify-center rounded-full p-1 text-gray-600 hover:bg-gray-100 focus:outline-none"
                        aria-label="Close"
                    >
                        <Cross2Icon />
                    </button>
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
);

export default AddDialog;
