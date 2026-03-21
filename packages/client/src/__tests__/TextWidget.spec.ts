import { describe, it, expect, vi, beforeEach } from "vitest"
import { mount, flushPromises } from "@vue/test-utils"
import TextWidget from "../components/TextWidget.vue"

const fetchMock = vi.fn()
vi.stubGlobal("fetch", fetchMock)

describe("TextWidget", () => {
  beforeEach(() => {
    fetchMock.mockReset()
  })

  it("renders textarea with initial text", () => {
    const wrapper = mount(TextWidget, {
      props: { id: 1, initialText: "hello" },
    })
    const textarea = wrapper.find("textarea")
    expect(textarea.exists()).toBe(true)
    expect((textarea.element as HTMLTextAreaElement).value).toBe("hello")
  })

  it("save button sends PUT with current text", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) })

    const wrapper = mount(TextWidget, {
      props: { id: 1, initialText: "" },
    })
    await wrapper.find("textarea").setValue("updated")
    await wrapper.find("[data-testid='save-btn']").trigger("click")
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledWith("/api/widgets/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "updated" }),
    })
  })

  it("delete button emits delete event", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true })

    const wrapper = mount(TextWidget, {
      props: { id: 1, initialText: "" },
    })
    await wrapper.find("[data-testid='delete-btn']").trigger("click")
    await flushPromises()

    expect(wrapper.emitted("delete")).toBeTruthy()
    expect(wrapper.emitted("delete")![0]).toEqual([1])
  })

  it("shows saved feedback after save", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) })

    const wrapper = mount(TextWidget, {
      props: { id: 1, initialText: "" },
    })
    await wrapper.find("[data-testid='save-btn']").trigger("click")
    await flushPromises()

    expect(wrapper.text()).toContain("Saved!")
  })
})
