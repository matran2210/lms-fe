import type { NextPage } from 'next'
import styles from '@styles/components/Home.module.scss'
import HookFormTextField from 'src/components/base/textfield/HookFormTextField'
import { useForm } from 'react-hook-form'
import ButtonPrimary from '@components/base/button/ButtonPrimary'
import ButtonIcon from '@components/base/button/ButtonIcon'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import ButtonText from '@components/base/button/ButtonText'
import ButtonOutlined from '@components/base/button/ButtonOutlined'
import PaginationSAPP from 'src/components/base/pagination/PaginationSAPP'
import HookFormSelect from 'src/components/base/select/HookFormSelect'
import { useState, useEffect, useMemo } from 'react'
import HookFormRadioGroup from '@components/base/radiobutton/HookFormRadioGroup'
import HookFormCheckBox from '@components/base/checkbox/HookFormCheckBox'
import data from '../../examples/data.json'

const StyleGuide: NextPage = () => {
  const radioOptions = [
    { value: 'Option 1', label: 'Option 1', description: 'description 1' },
    { value: 'Option 2', label: 'Option 2', description: 'description 2' },
    { value: 'Option 3', label: 'Option 3', description: 'description 3' },
  ]
  const { control } = useForm()

  // Pagination table
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [items, setItems] = useState<any>([])
  const [headers, setHeaders] =
    useState<{ key: string; label: string; className?: string }[]>()

  const currentItems = useMemo(() => {
    return items.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  }, [items, currentPage, pageSize])

  useEffect(() => {
    let partOfHeader: { key: string; label: string; className?: string }[] = []
    const newHeaders = [
      {
        label: 'Id',
        key: 'id',
        className: '',
      },
      ...partOfHeader,
      {
        label: 'First Name',
        key: 'fist-name',
        className: 'w-1/4',
      },
      {
        label: 'Last Name',
        key: 'last-name',
        className: 'w-1/4',
      },
      {
        label: 'Email',
        key: 'email',
        className: 'w-1/4',
      },
      {
        label: 'Phone',
        key: 'phone',
        className: 'w-1/4',
      },
    ]
    setHeaders(newHeaders)
    setItems(data)
  }, [])

  // Pagination row
  const [currentPageRow, setCurrentPageRow] = useState<number>(1)
  const [pageSizeRow, setPageSizeRow] = useState<number>(1)
  const [itemsRow, setItemsRow] = useState<any>([])
  const currentItemsRow = useMemo(() => {
    return itemsRow.slice(
      (currentPageRow - 1) * pageSizeRow,
      currentPageRow * pageSizeRow,
    )
  }, [itemsRow, currentPageRow, currentPageRow])

  useEffect(() => {
    setItemsRow(data)
  }, [])

  // Select
  const selectOptions = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ]

  return (
    <>
      <div className={styles.main}>StyleGuildePage</div>
      <div className="p-8">
        <h2 className="mb-4 text-3xl text-state-error">Input</h2>
        <HookFormTextField
          label="Default"
          required
          name="name"
          placeholder="Placeholder"
          control={control}
          className="w-full"
        />
      </div>
      <div className="p-8">
        <h2 className="mb-4 text-3xl text-state-error">Select</h2>
        <HookFormSelect
          options={selectOptions}
          defaultValue={{ value: 'vanilla', label: 'Vanilla' }}
          className={'mb-2'}
        ></HookFormSelect>
        <HookFormSelect
          options={selectOptions}
          defaultValue={{ value: 'vanilla', label: 'Vanilla' }}
          isMulti={true}
          className={''}
        ></HookFormSelect>
      </div>

      <div className="p-8">
        <h2 className="mb-4 text-3xl text-state-error">Pagination Table</h2>
        <table className="mb-3 table">
          <thead>
            <tr className={`text-start`}>
              {headers?.map((column, i) => (
                <th key={i} className={column.className}>
                  {column.label}
                </th>
              ))}
            </tr>
            {currentItems?.map((value: any) => {
              return (
                <tr className={`text-start`} key={value.id}>
                  <td>{value.id}</td>
                  <td>{value.first_name}</td>
                  <td>{value.last_name}</td>
                  <td>{value.email}</td>
                  <td>{value.phone}</td>
                </tr>
              )
            })}
          </thead>
        </table>
        <PaginationSAPP
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalItems={items.length}
          type={'table'}
        ></PaginationSAPP>

        <h2 className="mt-4 text-3xl text-state-error">Pagination Row</h2>
        <PaginationSAPP
          currentPage={currentPageRow}
          setCurrentPage={setCurrentPageRow}
          pageSize={pageSizeRow}
          setPageSize={setPageSizeRow}
          totalItems={itemsRow.length}
          type={'row'}
        ></PaginationSAPP>
      </div>
      <div className="p-8">
        <h2 className="mb-4 text-3xl text-state-error">Checkbox</h2>
        <div className="mx-3 border border-4 border-dashed border-bw-1 px-5 py-3">
          <HookFormCheckBox
            title="Right"
            required
            name="right"
            control={control}
            checked={true}
          />
          <br />
          <HookFormCheckBox
            title="Wrong"
            required
            name="wrong"
            control={control}
            checked={true}
            state={'error'}
          />
          <br />
          <HookFormCheckBox
            title="Default"
            required
            name="default"
            control={control}
          />
          <br />
          <HookFormCheckBox
            title="Disable"
            required
            name="disable"
            control={control}
            checked={true}
            disabled={true}
          />
        </div>
      </div>
      <div className="p-8">
        <h2 className="mb-4 text-3xl text-state-error">Radio</h2>
        <div className="mx-3 border border-4 border-dashed border-bw-1 px-5 py-3">
          <HookFormRadioGroup
            name="HookFormRadioGroup1"
            control={control}
            direction="horizontal"
            options={radioOptions}
          />
          <br />
          <hr />
          <br />
          <HookFormRadioGroup
            name="HookFormRadioGroup2"
            control={control}
            options={radioOptions}
          />
          <br />
          <hr />
          <br />
          <HookFormRadioGroup
            name="HookFormRadioGroup3"
            control={control}
            options={[
              { value: 'Available option', label: 'Available option' },
              { value: 'Available option 2', label: 'Available option 2' },
              {
                value: 'Disable option 2',
                label: 'Disable option 2',
                disabled: true,
              },
            ]}
          />
          <br />
          <hr />
          <br />
          <HookFormRadioGroup
            name="HookFormRadioGroup4"
            control={control}
            disabled={true}
            options={[
              { value: 'Disable option', label: 'Disable option' },
              { value: 'Disable option 2', label: 'Disable option 2' },
            ]}
          />
        </div>
      </div>
      <div className="p-8">
        <h2 className="mb-4 text-3xl text-state-error">Buttons</h2>
        <div className="mx-3 flex flex-col items-center border border-4 border-dashed border-bw-1 px-5 py-3">
          <div>
            <ButtonPrimary
              title="ButtonPrimary lager"
              full={false}
              size={'lager'}
            />
            <span className="px-2"></span>
            <ButtonPrimary
              title="ButtonPrimary medium"
              full={false}
              size={'medium'}
            />
            <span className="px-2"></span>
            <ButtonPrimary
              title="ButtonPrimary small"
              full={false}
              size={'small'}
            />
            <span className="px-2"></span>
            <ButtonIcon>+</ButtonIcon>
          </div>
          <br />
          <br />
          <div>
            <ButtonSecondary
              title="ButtonSecondary lager"
              full={false}
              size={'lager'}
            />
            <span className="px-2"></span>
            <ButtonSecondary
              title="ButtonSecondary medium"
              full={false}
              size={'medium'}
            />
            <span className="px-2"></span>
            <ButtonSecondary
              title="ButtonSecondary small"
              full={false}
              size={'small'}
            />
          </div>
          <br />
          <br />
          <div>
            <ButtonOutlined
              title="ButtonOutlined lager"
              full={false}
              size={'lager'}
            />
            <span className="px-2"></span>
            <ButtonOutlined
              title="ButtonOutlined medium"
              full={false}
              size={'medium'}
            />
            <span className="px-2"></span>
            <ButtonOutlined
              title="ButtonOutlined small"
              full={false}
              size={'small'}
            />
          </div>
          <br />
          <br />
          <div>
            <ButtonText title="ButtonText lager" full={false} size={'lager'} />
            <span className="px-2"></span>
            <ButtonText
              title="ButtonText medium"
              full={false}
              size={'medium'}
            />
            <span className="px-2"></span>
            <ButtonText title="ButtonText small" full={false} size={'small'} />
          </div>
          <br />
          <br />
          <br />
          <div>
            <ButtonPrimary
              title="ButtonPrimary link medium"
              link="#"
              full={false}
              size={'medium'}
            />
            <span className="px-2"></span>
            <ButtonSecondary
              title="ButtonSecondary link medium"
              link="#"
              full={false}
              size={'medium'}
            />
            <span className="px-2"></span>
            <ButtonOutlined
              title="ButtonOutlined link medium"
              link="#"
              full={false}
              size={'medium'}
            />
            <span className="px-2"></span>
            <ButtonText
              title="ButtonText link medium"
              link="#"
              full={false}
              size={'medium'}
            />
          </div>
          <br />
          <br />
          <br />
          <ButtonPrimary
            title="ButtonPrimary full width lager"
            full={true}
            size={'lager'}
          />
          <br />
          <ButtonSecondary
            title="ButtonSecondary full width lager"
            full={true}
            size={'lager'}
          />
          <br />
          <ButtonOutlined
            title="ButtonOutlined full width lager"
            full={true}
            size={'lager'}
          />
          <br />
          <ButtonText
            title="ButtonText full width lager"
            full={true}
            size={'lager'}
          />
          <br />
          <br />
          <br />
          <ButtonPrimary
            title="ButtonPrimary link full width lager"
            link="#"
            full={true}
            size={'lager'}
          />
          <br />
          <ButtonSecondary
            title="ButtonSecondary link full width lager"
            link="#"
            full={true}
            size={'lager'}
          />
          <br />
          <ButtonOutlined
            title="ButtonOutlined link full width lager"
            link="#"
            full={true}
            size={'lager'}
          />
          <br />
          <ButtonText
            title="ButtonText link full width lager"
            link="#"
            full={true}
            size={'lager'}
          />
          <br />
        </div>
      </div>
    </>
  )
}

export default StyleGuide
