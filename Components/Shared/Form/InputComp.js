// import { Input, Form } from "antd";
// import { Controller  } from "react-hook-form";
// const InputComp = (props) => {
//   return (
//     <>
//     <Controller
//       name={`${props.name}`}
//       defaultValue=""
//       control={props.control}
//       {...props.register(`${props.name}`)}
//       render={({ field }) => (
//           <>
//             <div>{props.label}</div>
//             <Input disabled={props.disabled} style={{minWidth:props.width}} {...field} />
//           </>
//       )}
//     />
//     </>
//   )
// }
// export default InputComp

import { Input } from "antd";
import { useController } from "react-hook-form";

const InputComp = (props) => {
  const { control, name } = props;
  const { field: { onChange, onBlur, value, name: fieldName, ref } } = useController({ control, name });
  return (
    <>
      <div>{props.label}</div>
      <Input 
        disabled={props.disabled} style={{minWidth:props.width}} {...props.field} 
        name={fieldName} onChange={onChange} value={value} ref={ref} onBlur={onBlur} showSearch
      />
    </>
  )
}

export default InputComp