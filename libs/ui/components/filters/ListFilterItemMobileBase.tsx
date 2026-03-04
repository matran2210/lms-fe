import { CheckIconV2 } from "@lms/assets"
import clsx from "clsx"
import type { UIEvent } from "react"

interface IData {
    label: string
    value: string
}

interface IProps {
    data?: IData[]
    handleSelect: (item: { label: string, value: string } | { label: string, value: string }[]) => void
    selected?: IData | IData[]
    handleNextPage?: () => void
    isMultiSelect?: boolean
}

const ListFilterItemMobileBase = ({
    data = [] as IData[],
    handleSelect,
    selected,
    handleNextPage,
    isMultiSelect = false,
}: IProps) => {
    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget
        const isBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 8
        if (isBottom) {
            handleNextPage?.()
        }
    }

    const isSelected = (item: IData) => {
        if (isMultiSelect) {
            const selectedArray = Array.isArray(selected) ? selected : []
            return selectedArray.some(sel => sel.value === item.value)
        }
        return !Array.isArray(selected) && selected?.value === item.value
    }

    const handleItemClick = (item: IData) => {
        if (isMultiSelect) {
            const selectedArray = Array.isArray(selected) ? selected : []
            const isItemSelected = selectedArray.some(sel => sel.value === item.value)
            
            if (isItemSelected) {
                const newSelection = selectedArray.filter(sel => sel.value !== item.value)
                handleSelect(newSelection)
            } else {
                const newSelection = [...selectedArray, item]
                handleSelect(newSelection)
            }
        } else {
            handleSelect(item)
        }
    }
    return (
        <div
            className="flex max-h-[250px] min-h-1 flex-1 flex-col overflow-y-auto"
            onScroll={handleScroll}
        >
            {data.map((item) => (
                <div
                    key={item.value}
                    className="flex items-center justify-between py-2"
                    onClick={() => handleItemClick(item)}
                >
                    <div
                        className={clsx(
                            "text-sm font-medium text-gray-800 cursor-pointer",
                            isSelected(item) && "text-primary",
                        )}
                    >
                        {item.label}
                    </div>
                    <div>{isSelected(item) && <CheckIconV2 />}</div>
                </div>
            ))}
        </div>
    )
}

export default ListFilterItemMobileBase
