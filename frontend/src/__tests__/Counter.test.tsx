import { render } from "@testing-library/react";
import { act, Simulate } from "react-dom/test-utils";
import Counter from "../components/Counter";

test('click once on counter' ,async ()=>{
    const wrapper = render(<Counter/>)

    const button = await wrapper.findByTestId('counter-button')

    act(()=>{
        Simulate.click(button)
    })

    expect(wrapper).toMatchSnapshot()
})