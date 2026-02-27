"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { useEffect, useState } from "react";

type category = {
    name: string,
    id: string
}
type subcategories = {
    name: string,
    id: string
}
type Props = {
    categories: category[],
    subcategories: subcategories[]
}
export default function ItemSearch( {categories, subcategories}: Props) {
    const searchParams = useSearchParams()
    const router = useRouter();
    const pathName = usePathname();
    const [inputValue, setInputValue ] = useState(searchParams.get("query") ?? "")

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (inputValue) {
                params.set("query", inputValue);
            } else {
                params.delete("query");
            }
            router.replace('${pathname}?${params.toString()}')}, 300)
            return () => clearTimeout(timeout)
        }, [inputValue])

    return(
        <input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            />
    )
}