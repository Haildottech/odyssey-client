import { Select } from "antd";
import { useController } from "react-hook-form";

const SelectSearchComp = (props) => {
    const { control, name } = props;
    const { field: { onChange, onBlur, value, name: fieldName, ref } } = useController({ control, name });

    const SelectSearch =({props, rest}) => {
        let tempVal = [];
        props.options.forEach((x) => {
            tempVal.push({
                value:x.id,
                label:x.name,
                code:x.code
            })
        });
        return(
            <Select disabled={props.disabled} style={{minWidth:props.width||200, maxWidth:props.width||200, fontSize:props.font||15}}
                name={fieldName} onChange={onChange} value={value} ref={ref} onBlur={onBlur} showSearch allowClear
                optionFilterProp="children"
                filterOption={(input, option) =>
                    ((option?.label) ?? '').toLowerCase().includes(input.toLowerCase())||
                    ((option?.code) ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={tempVal}
                {...rest}
            />
    )}

return(
    <>
        <div className="">{props.label}</div>
        <SelectSearch props={props} rest={props.rest} />
    </>

)}

export default SelectSearchComp