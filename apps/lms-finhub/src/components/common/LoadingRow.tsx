import { Skeleton } from 'antd'

const LoadingRow = ({ headers }: { headers: Array<any> }) => {
  return (
    <tr>
      {headers.map((header) => (
        <td key={header}>
          <Skeleton.Input size="default" active className="m-0.5" />
        </td>
      ))}
    </tr>
  )
}

export default LoadingRow
