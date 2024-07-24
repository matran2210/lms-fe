import HookFormSelect from '@components/base/select/HookFormSelect'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ISection, ISelect } from 'src/type'

interface IProps {
  setSelected: React.Dispatch<ISelect | null>
  sections: ISection[]
  selectedSection: ISelect | null
  setSelectedSection: React.Dispatch<ISelect | null>
  subSections: ISection[]
  selectedSubsection: ISelect | null
  setSelectedSubsection: React.Dispatch<ISelect | null>
  units: ISection[]
  selectedUnit: ISelect | null
  setSelectedUnit: React.Dispatch<ISelect | null>
  activities: ISection[]
  selectedActivity: ISelect | null
  setSelectedActivity: React.Dispatch<ISelect | null>
  fetchNextPage: any
}
const ResultsTableFilter = ({
  setSelected,
  sections,
  selectedSection,
  setSelectedSection,
  subSections,
  selectedSubsection,
  setSelectedSubsection,
  units,
  selectedUnit,
  setSelectedUnit,
  activities,
  selectedActivity,
  setSelectedActivity,
  fetchNextPage,
}: IProps) => {
  const DEFAULT_SELECT_SECTION = [{ label: 'All Section', value: '' }]

  return (
    <>
      {/* Section */}
      <HookFormSelect
        classParent="w-full md:max-w-full"
        placeholder="Section"
        isClearable={true}
        value={selectedSection}
        onChange={(selected: ISelect) => {
          setSelected(selected)
          setSelectedSection(selected)
        }}
        options={
          sections
            ? sections?.map((subsection) => ({
                label: subsection.name,
                value: subsection.id,
              }))
            : []
        }
      />

      {/* SubSection */}
      <HookFormSelect
        classParent="w-full md:max-w-full"
        placeholder="Subsection"
        isClearable={true}
        value={selectedSubsection}
        onChange={(selected: ISelect) => {
          setSelected(selected)
          setSelectedSubsection(selected)
        }}
        options={
          selectedSection
            ? subSections?.map((subsection) => ({
                label: subsection.name,
                value: subsection.id,
              }))
            : []
        }
        isDisabled={selectedSection === null || selectedSection?.value === ''}
      />

      {/* Unit */}
      <HookFormSelect
        classParent="w-full md:max-w-full"
        placeholder="Unit"
        isClearable={true}
        value={selectedUnit}
        onChange={(selected: ISelect) => {
          setSelected(selected)
          setSelectedUnit(selected)
        }}
        options={
          selectedSubsection
            ? units?.map((unit) => ({
                label: unit.name,
                value: unit.id,
              }))
            : []
        }
        isDisabled={selectedSubsection === null}
      />

      {/* Activity */}
      <HookFormSelect
        classParent="w-full md:max-w-full"
        placeholder="Activity"
        isClearable={true}
        value={selectedActivity}
        onChange={(selected: ISelect) => {
          setSelected(selected)
          setSelectedActivity(selected)
        }}
        options={
          selectedUnit
            ? activities?.map((unit) => ({
                label: unit.name,
                value: unit.id,
              }))
            : []
        }
        isDisabled={selectedUnit === null}
      />
    </>
  )
}

export default ResultsTableFilter
