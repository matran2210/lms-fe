import HookFormSelect from '@components/base/select/HookFormSelect'
import { ISection, ISelect } from 'src/type'

interface IProps {
  setSelected: React.Dispatch<ISelect | null>

  sections: ISection[]
  selectedSection: ISelect | null
  setSelectedSection: React.Dispatch<ISelect | null>
  fetchNextSectionPage: any
  hasNextSectionPage: any

  subSections: ISection[]
  selectedSubsection: ISelect | null
  setSelectedSubsection: React.Dispatch<ISelect | null>
  hasNextSubsectionPage: any
  fetchNextSubsectionPage: any

  units: ISection[]
  selectedUnit: ISelect | null
  setSelectedUnit: React.Dispatch<ISelect | null>
  hasNextUnitPage: any
  fetchNextUnitPage: any

  activities: ISection[]
  selectedActivity: ISelect | null
  setSelectedActivity: React.Dispatch<ISelect | null>
  hasNextActivityPage: any
  fetchNextActivityPage: any
}
const ResultsTableFilter = ({
  setSelected,

  sections,
  selectedSection,
  setSelectedSection,
  hasNextSectionPage,
  fetchNextSectionPage,

  subSections,
  selectedSubsection,
  setSelectedSubsection,
  hasNextSubsectionPage,
  fetchNextSubsectionPage,

  units,
  selectedUnit,
  setSelectedUnit,
  hasNextUnitPage,
  fetchNextUnitPage,

  activities,
  selectedActivity,
  setSelectedActivity,
  hasNextActivityPage,
  fetchNextActivityPage,
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
        onMenuScrollToBottom={hasNextSubsectionPage && fetchNextSubsectionPage}
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
        onMenuScrollToBottom={hasNextUnitPage && fetchNextUnitPage}
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
        onMenuScrollToBottom={hasNextActivityPage && fetchNextActivityPage}
      />
    </>
  )
}

export default ResultsTableFilter
