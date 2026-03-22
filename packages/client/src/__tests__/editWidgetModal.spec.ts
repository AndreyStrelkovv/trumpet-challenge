import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import EditWidgetModal from "../components/editWidgetModal.vue"

const defaultProps = {
  text: "hello world",
  docType: "DOC_TYPE_1" as const,
}

describe("EditWidgetModal", () => {
  it("renders textarea pre-filled with current text", () => {
    const wrapper = mount(EditWidgetModal, { props: defaultProps })
    const textarea = wrapper.find("textarea")
    expect((textarea.element as HTMLTextAreaElement).value).toBe("hello world")
  })

  it("renders docType select pre-filled with current docType", () => {
    const wrapper = mount(EditWidgetModal, { props: defaultProps })
    const select = wrapper.find("[data-testid='modal-doctype-select']")
    expect((select.element as HTMLSelectElement).value).toBe("DOC_TYPE_1")
  })

  it("save emits save with updated text and docType", async () => {
    const wrapper = mount(EditWidgetModal, { props: defaultProps })
    await wrapper.find("textarea").setValue("updated text")
    await wrapper.find("[data-testid='modal-save-btn']").trigger("click")

    expect(wrapper.emitted("save")).toBeTruthy()
    expect(wrapper.emitted("save")![0]).toEqual([
      { text: "updated text", docType: "DOC_TYPE_1" },
    ])
  })

  it("emits trimmed text on save", async () => {
    const wrapper = mount(EditWidgetModal, { props: { text: "  padded  " } })
    await wrapper.find("[data-testid='modal-save-btn']").trigger("click")

    expect(wrapper.emitted("save")![0]).toEqual([
      { text: "padded", docType: undefined },
    ])
  })

  it("cancel emits cancel", async () => {
    const wrapper = mount(EditWidgetModal, { props: defaultProps })
    await wrapper.find("[data-testid='modal-cancel-btn']").trigger("click")

    expect(wrapper.emitted("cancel")).toBeTruthy()
  })

  it.each(["", "   "])("does not emit save and shows error for blank text '%s'", async (text) => {
    const wrapper = mount(EditWidgetModal, { props: { text } })
    await wrapper.find("[data-testid='modal-save-btn']").trigger("click")

    expect(wrapper.emitted("save")).toBeFalsy()
    expect(wrapper.find("[data-testid='text-error']").text()).toBe("Text is required")
  })

  it("clears error when user types valid text and saves", async () => {
    const wrapper = mount(EditWidgetModal, { props: { text: "" } })
    await wrapper.find("[data-testid='modal-save-btn']").trigger("click")

    expect(wrapper.find("[data-testid='text-error']").exists()).toBe(true)

    await wrapper.find("textarea").setValue("valid text")
    await wrapper.find("[data-testid='modal-save-btn']").trigger("click")

    expect(wrapper.find("[data-testid='text-error']").exists()).toBe(false)
    expect(wrapper.emitted("save")).toBeTruthy()
  })

  it("works without initial docType", async () => {
    const wrapper = mount(EditWidgetModal, { props: { text: "test" } })
    await wrapper.find("[data-testid='modal-save-btn']").trigger("click")

    expect(wrapper.emitted("save")![0]).toEqual([
      { text: "test", docType: undefined },
    ])
  })
})
