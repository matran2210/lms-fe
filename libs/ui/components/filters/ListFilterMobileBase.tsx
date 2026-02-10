import { CollapseArrowIcon } from "@lms/assets"

interface ISelectItem {
    label: string
    value: string
}
interface IProps {
    data?: ISelectItem[]
    handleClick: (item: string) => void
    selected?: Record<string, ISelectItem | ISelectItem[]>
}

const ListFilterMobileBase = ({
    data = [] as ISelectItem[],
    handleClick,
    selected = {} 
}: IProps) => {

    return (
        <div className="flex flex-1 flex-col">
            {data.map((item) => (
                <div
                    className="flex items-center justify-between py-2 text-gray-800 cursor-pointer"
                    key={item.label}
                    onClick={() => handleClick(item.label)}
                >
                    <div className="text-sm font-normal">
                        {(() => {
                            const selectedValue = selected?.[item.label]
                            if (Array.isArray(selectedValue)) {
                                return selectedValue.length > 0 
                                    ? selectedValue.map(s => s.label).join(', ')
                                    : item.label
                            }
                            return selectedValue?.label ? selectedValue.label : item.label
                        })()}
                    </div>
                    <div>
                        <CollapseArrowIcon className="rotate-[270deg]" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ListFilterMobileBase