import HookFormSelect from '@components/base/select/HookFormSelect'
import { Dispatch, SetStateAction } from 'react'
import { ISection } from 'src/type'
import { ISelect } from 'src/type/course'

interface IProps {
  setSelected: React.Dispatch<ISelect | null>

  sections: ISection[]
  selectedSection: ISelect | null
  setSelectedSection: React.Dispatch<ISelect | null>
  fetchNextSectionPage: any
  hasNextSectionPage: any
  isSectionLoading: boolean

  subSections: ISection[]
  setSubSections: Dispatch<SetStateAction<ISection[]>>
  selectedSubsection: ISelect | null
  setSelectedSubsection: React.Dispatch<ISelect | null>
  hasNextSubsectionPage: any
  fetchNextSubsectionPage: any
  isSubsectionLoading: boolean

  units: ISection[]
  selectedUnit: ISelect | null
  setUnits: Dispatch<SetStateAction<ISection[]>>
  setSelectedUnit: React.Dispatch<ISelect | null>
  hasNextUnitPage: any
  fetchNextUnitPage: any
  isUnitLoading: boolean

  activities: ISection[]
  selectedActivity: ISelect | null
  setActivities: Dispatch<SetStateAction<ISection[]>>
  setSelectedActivity: React.Dispatch<ISelect | null>
  hasNextActivityPage: any
  fetchNextActivityPage: any
  isActivityLoading: boolean
}
const ResultsTableFilter = ({
  setSelected,

  sections,
  selectedSection,
  setSelectedSection,
  hasNextSectionPage,
  fetchNextSectionPage,
  isSectionLoading,

  subSections,
  setSubSections,
  selectedSubsection,
  setSelectedSubsection,
  hasNextSubsectionPage,
  fetchNextSubsectionPage,
  isSubsectionLoading,

  units,
  setUnits,
  selectedUnit,
  setSelectedUnit,
  hasNextUnitPage,
  fetchNextUnitPage,
  isUnitLoading,

  activities,
  setActivities,
  selectedActivity,
  setSelectedActivity,
  hasNextActivityPage,
  fetchNextActivityPage,
  isActivityLoading,
}: IProps) => {
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
          setSubSections([])
        }}
        options={
          sections
            ? sections?.map((subsection) => ({
                label: subsection.name,
                value: subsection.id,
              }))
            : []
        }
        onMenuScrollToBottom={hasNextSectionPage && fetchNextSectionPage}
        isLoading={isSectionLoading}
      />

      {/* SubSection */}
      <HookFormSelect
        classParent="w-full md:max-w-full"
        placeholder="Subsection"
        isClearable={true}
        value={selectedSubsection}
        onChange={(selected: ISelect) => {
          setSelectedSubsection(selected)
          selected === null
            ? setSelected(selectedSection)
            : setSelected(selected)
          setUnits([])
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
        onMenuScrollToBottom={hasNextSubsectionPage && fetchNextSubsectionPage}
        isLoading={isSubsectionLoading}
      />

      {/* Unit */}
      <HookFormSelect
        classParent="w-full md:max-w-full"
        placeholder="Unit"
        isClearable={true}
        value={selectedUnit}
        onChange={(selected: ISelect) => {
          setSelectedUnit(selected)
          selected === null
            ? setSelected(selectedSubsection)
            : setSelected(selected)
          setActivities([])
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
        onMenuScrollToBottom={hasNextUnitPage && fetchNextUnitPage}
        isLoading={isUnitLoading}
      />

      {/* Activity */}
      <HookFormSelect
        classParent="w-full md:max-w-full"
        placeholder="Activity"
        isClearable={true}
        value={selectedActivity}
        onChange={(selected: ISelect) => {
          setSelectedActivity(selected)
          selected === null ? setSelected(selectedUnit) : setSelected(selected)
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
        onMenuScrollToBottom={hasNextActivityPage && fetchNextActivityPage}
        isLoading={isActivityLoading}
      />
    </>
  )
}

export default ResultsTableFilter
