import HighlightableText from '@components/highlights/HighlightableText'
import { HighlightableHTML } from '@components/highlights/HighlightHTML'
import React from 'react'

const index = () => {
  return (
    <div>
      <HighlightableText
        text={`Đây là một đoạn văn bản dùng để demo tính năng highlight. Bạn có thể bôi đen một cụm từ bất kỳ.`}
      />
      <HighlightableHTML
        initialHTML={
          '<p><strong style="font-weight: bold;"><span style="white-space: pre-wrap;"><span style="white-space: pre-wrap;">Topic Description:</span><!--EndFragment--> </span></strong></p><p><!--StartFragment--><span style="white-space: pre-wrap;">Question practice is a vital part of exam preparation. Being able to practice in the CBE environment provides a fantastic opportunity to get fully prepared for the real exam.</span><!--EndFragment--></p><p><!--StartFragment--><span style="white-space: pre-wrap;">Đ&acirc;y l&agrave; nội dung của Requirement, identify and explain TWO ethical threats which may affect the independence of Apricot &amp; CO audit of Peach Co and make money vip pro (2 marks)</span><!--EndFragment--></p><p><!--StartFragment--><span style="white-space: pre-wrap;">Đ&acirc;y l&agrave; nội dung của Requirement, identify and explain TWO ethical threats which may affect the independence of Apricot &amp; CO audit of Peach Co and make money vip pro (2 marks)</span><!--EndFragment--></p>'
        }
        storageKey="test"
      />
    </div>
  )
}

export default index
