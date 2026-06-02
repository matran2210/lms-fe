import { QUESTION_TYPES } from "@lms/core";
import ChoiceQuestionBlock from "./ChoiceQuestionBlock";
import DragDropQuestionBlock from "./DragDropQuestionBlock";
import EssayQuestionBlock from "./EssayQuestionBlock";
import FillWordQuestionBlock from "./FillWordQuestionBlock";
import MatchingQuestionBlock from "./MatchingQuestionBlock";
import MultiChoiceQuestionBlock from "./MultiChoiceQuestionBlock";
import SelectWordQuestionBlock from "./SelectWordQuestionBlock";

export interface QuestionRendererProps {
  type: QUESTION_TYPES;
  currentTabContent: any
  data: any;
  currentTabID: string;
  defaultValue: any;
  corrects?: any;
  highlighted?: any;
  solution?: any;
  done?: boolean;

  control: any;
  setValue: (name: string, value: any) => void;
  getValues: (name: string) => any;
  watch?: any;

  handleSaveHighLight: (...args: any[]) => void;
  removeHighlight: (...args: any[]) => void;
  allowHighLight: boolean;
  allowUnHighLight: boolean;

  storageKey: string;

  // Optional cho từng loại
  tabs?: any[];
  currentPage?: string;
  ref?: any;

  // Essay only
  essayData?: any;
  refEditor?: any;
  setEssayData?: any;
  setOpenUpload?: any;
  handleClearFile?: any;
  handleOpenScratchPad?: any;
  handleSaveHighLightRequirement?: any;
  showListRequirement?: any;
  editorReady?: boolean;
}

export default function QuestionRenderer(props: QuestionRendererProps) {
  const { type } = props;

  switch (type) {
    case QUESTION_TYPES.ONE_CHOICE:
    case QUESTION_TYPES.TRUE_FALSE:
      return <ChoiceQuestionBlock {...props} />;

    case QUESTION_TYPES.MULTIPLE_CHOICE:
      if (!props.tabs || !props.currentPage) return null;
      return (
        <MultiChoiceQuestionBlock
          {...props}
          tabs={props.tabs}
          currentPage={props.currentPage}
        />
      );

    case QUESTION_TYPES.MATCHING:
      if (!props.watch) return null;
      return <MatchingQuestionBlock {...props} />;

    case QUESTION_TYPES.FILL_WORD:
      return (
        <FillWordQuestionBlock {...props} watch={props.watch} ref={props.ref} />
      );

    case QUESTION_TYPES.DRAG_DROP:
      return <DragDropQuestionBlock {...props} />;

    case QUESTION_TYPES.SELECT_WORD:
      return <SelectWordQuestionBlock {...props} ref={props.ref} />;

    case QUESTION_TYPES.ESSAY:
      if (!props.essayData || !props.refEditor ) return null;
      return (
        <EssayQuestionBlock
          data={props.data}
          currentTabID={props.currentTabID}
          defaultValue={props.defaultValue}
          corrects={props.corrects}
          highlighted={props.highlighted}
          solution={props.solution}
          done={props.done}
          control={props.control}
          setValue={props.setValue}
          getValues={props.getValues}
          handleSaveHighLight={props.handleSaveHighLight}
          removeHighlight={props.removeHighlight}
          allowHighLight={props.allowHighLight}
          allowUnHighLight={props.allowUnHighLight}
          storageKey={props.storageKey}
          essayData={props.essayData}
          refEditor={props.refEditor}
          currentPage={props.currentPage!}
          setOpenUpload={props.setOpenUpload!}
          handleClearFile={props.handleClearFile!}
          handleOpenScratchPad={props.handleOpenScratchPad!}
          handleSaveHighLightRequirement={props.handleSaveHighLightRequirement!}
          showListRequirement={props.showListRequirement!}
          setEssayData={props.setEssayData!}
          currentTabContent={props.currentTabContent}
          editorReady={props.editorReady!}
        />
      );
    default:
      return null;
  }
}
