import { Key } from "ink";

export const getRawInput = (input : string, key : Key) => key.escape
? '[ESC]'
: key.return
? '[RETURN]'
: key.backspace
? '[BACKSPACE]'
: key.downArrow
? '[DOWN]'
: key.upArrow
? '[UP]'
: key.leftArrow
? '[LEFT]'
: key.rightArrow
? '[RIGHT]'
: key.delete
? '[DELETE]'
: key.tab
? '[TAB]'
: input