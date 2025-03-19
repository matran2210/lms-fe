import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

interface SearchStudentInputProps {
  placeholder?: string
  width?: string
}

const SearchStudentInput: React.FC<SearchStudentInputProps> = ({
  placeholder = 'Search student',
  width = 'max-w-sm',
}) => {
  return (
    <div className={`w-full ${width}`}>
      <Input
        placeholder={placeholder}
        prefix={<SearchOutlined className="text-gray-400" />}
        className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

export default SearchStudentInput
