import ActionItem from './ActionItem'
import TableActionCell from './TableActionCell'

interface IProps {
  isShowViewButton?: boolean
  labelButtonView?: string
  handleClickView?: () => void

  isShowEditButton?: boolean
  labelButtonEdit?: string
  handleClickEdit?: () => void

  isShowDeleteButton?: boolean
  labelButtonDelete?: string
  handleClickDelete?: () => void
}

const SappActionCell = ({
  isShowViewButton = true,
  labelButtonView = 'View',
  handleClickView = () => undefined,
  isShowEditButton = false,
  labelButtonEdit = 'Edit',
  handleClickEdit = () => undefined,
  isShowDeleteButton = false,
  labelButtonDelete = 'Delete',
  handleClickDelete = () => undefined,
}: IProps) => {
  const handleDelayAction = (actionFunc: () => void) => {
    setTimeout(() => {
      actionFunc()
    }, 300)
  }
  return (
    <TableActionCell>
      {(closeDropdown) => (
        <div className="flex flex-col">
          <ActionItem
            title={labelButtonView}
            onClick={() => {
              closeDropdown()
              handleDelayAction(handleClickView)
            }}
            isShow={isShowViewButton}
            className="hover:bg-[#FFFDF6] hover:text-[#FFB800]"
          />
          <ActionItem
            title={labelButtonEdit}
            onClick={() => {
              closeDropdown()
              handleDelayAction(handleClickEdit)
            }}
            isShow={isShowEditButton}
          />
          <ActionItem
            title={labelButtonDelete}
            onClick={() => {
              closeDropdown()
              handleDelayAction(handleClickDelete)
            }}
            isShow={isShowDeleteButton}
          />
        </div>
      )}
    </TableActionCell>
  )
}

export default SappActionCell
