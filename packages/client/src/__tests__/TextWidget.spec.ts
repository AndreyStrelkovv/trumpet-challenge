import { describe, it, expect, vi, beforeEach } from "vitest"
import { mount, flushPromises } from "@vue/test-utils"
import TextWidget from "../components/TextWidget.vue"
import EditWidgetModal from "../components/EditWidgetModal.vue"
import * as widgetApi from "../api/widgetApi"

vi.mock("../api/widgetApi")

const mockedUpdateWidget = vi.mocked(widgetApi.updateWidget)
const mockedDeleteWidget = vi.mocked(widgetApi.deleteWidget)

const defaultProps = {
  id: 1,
  initialText: "hello",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
}

describe("TextWidget", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("shows widget text as read-only", () => {
    const wrapper = mount(TextWidget, { props: defaultProps })
    expect(wrapper.find("[data-testid='widget-text']").text()).toBe("hello")
    expect(wrapper.find("textarea").exists()).toBe(false)
  })

  it("shows docType badge inline with dates at the top", () => {
    const wrapper = mount(TextWidget, {
      props: { ...defaultProps, initialDocType: "DOC_TYPE_2" },
    })
    const topBar = wrapper.find("[data-testid='widget-meta']")
    const badge = topBar.find("[data-testid='doctype-badge']")
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe("DOC_TYPE_2")
  })

  it("has edit button", () => {
    const wrapper = mount(TextWidget, { props: defaultProps })
    expect(wrapper.find("[data-testid='edit-btn']").exists()).toBe(true)
  })

  it("clicking edit shows modal", async () => {
    const wrapper = mount(TextWidget, { props: defaultProps })
    expect(wrapper.findComponent(EditWidgetModal).exists()).toBe(false)

    await wrapper.find("[data-testid='edit-btn']").trigger("click")
    expect(wrapper.findComponent(EditWidgetModal).exists()).toBe(true)
  })

  it("modal save triggers PUT and emits saved", async () => {
    mockedUpdateWidget.mockResolvedValueOnce({
      id: 1,
      text: "updated",
      createdAt: defaultProps.createdAt,
      updatedAt: defaultProps.updatedAt,
      docType: "DOC_TYPE_1",
    })

    const wrapper = mount(TextWidget, { props: defaultProps })
    await wrapper.find("[data-testid='edit-btn']").trigger("click")

    const modal = wrapper.findComponent(EditWidgetModal)
    modal.vm.$emit("save", { text: "updated", docType: "DOC_TYPE_1" })
    await flushPromises()

    expect(mockedUpdateWidget).toHaveBeenCalledWith(1, {
      text: "updated",
      docType: "DOC_TYPE_1",
    })
    expect(wrapper.emitted("saved")).toBeTruthy()
    expect(wrapper.findComponent(EditWidgetModal).exists()).toBe(false)
  })

  it("modal cancel closes modal", async () => {
    const wrapper = mount(TextWidget, { props: defaultProps })
    await wrapper.find("[data-testid='edit-btn']").trigger("click")
    expect(wrapper.findComponent(EditWidgetModal).exists()).toBe(true)

    const modal = wrapper.findComponent(EditWidgetModal)
    modal.vm.$emit("cancel")
    await flushPromises()

    expect(wrapper.findComponent(EditWidgetModal).exists()).toBe(false)
  })

  it("delete button emits delete event", async () => {
    mockedDeleteWidget.mockResolvedValueOnce(undefined)

    const wrapper = mount(TextWidget, { props: defaultProps })
    await wrapper.find("[data-testid='delete-btn']").trigger("click")
    await flushPromises()

    expect(wrapper.emitted("delete")).toBeTruthy()
    expect(wrapper.emitted("delete")![0]).toEqual([1])
  })

  it("displays relative timestamps for created and updated dates", () => {
    const wrapper = mount(TextWidget, { props: defaultProps })
    const meta = wrapper.find("[data-testid='widget-meta']").text()
    expect(meta).toContain("Created:")
    expect(meta).toContain("Updated:")
    expect(meta).toMatch(/\d+\w+ ago/)
  })
})
