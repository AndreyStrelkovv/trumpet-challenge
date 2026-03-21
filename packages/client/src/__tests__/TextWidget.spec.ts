import { describe, it, expect, vi, beforeEach } from "vitest"
import { mount, flushPromises } from "@vue/test-utils"
import TextWidget from "../components/TextWidget.vue"

const fetchMock = vi.fn()
vi.stubGlobal("fetch", fetchMock)

const defaultProps = {
  id: 1,
  initialText: "",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
}

describe("TextWidget", () => {
  beforeEach(() => {
    fetchMock.mockReset()
  })

  it("renders textarea with initial text", () => {
    const wrapper = mount(TextWidget, {
      props: { ...defaultProps, initialText: "hello" },
    })
    const textarea = wrapper.find("textarea")
    expect((textarea.element as HTMLTextAreaElement).value).toBe("hello")
  })

  it("save button sends PUT with text and docType", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) })

    const wrapper = mount(TextWidget, {
      props: defaultProps,
    })
    await wrapper.find("textarea").setValue("updated")
    await wrapper.find("[data-testid='save-btn']").trigger("click")
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledWith("/api/widgets/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "updated", docType: null }),
    })
  })

  it("delete button emits delete event", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true })

    const wrapper = mount(TextWidget, {
      props: defaultProps,
    })
    await wrapper.find("[data-testid='delete-btn']").trigger("click")
    await flushPromises()

    expect(wrapper.emitted("delete")).toBeTruthy()
    expect(wrapper.emitted("delete")![0]).toEqual([1])
  })

  it("shows saved feedback after save", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) })

    const wrapper = mount(TextWidget, {
      props: defaultProps,
    })
    await wrapper.find("[data-testid='save-btn']").trigger("click")
    await flushPromises()

    expect(wrapper.text()).toContain("Saved!")
  })

  it("renders docType selector", () => {
    const wrapper = mount(TextWidget, {
      props: { ...defaultProps, initialDocType: "DOC_TYPE_1" },
    })
    const select = wrapper.find("[data-testid='doctype-select']")
    expect(select.exists()).toBe(true)
    expect((select.element as HTMLSelectElement).value).toBe("DOC_TYPE_1")
  })

  it("displays created and updated dates", () => {
    const wrapper = mount(TextWidget, {
      props: defaultProps,
    })
    expect(wrapper.text()).toContain("Created:")
    expect(wrapper.text()).toContain("Updated:")
  })
})
