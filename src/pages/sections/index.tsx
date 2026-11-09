import { Container, Flex, Loader } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import ExpiryTimer from "../../components/ExpiryTimer";
import SectionContent from "../../components/section/SectionContent";
import SectionFloatingActions from "../../components/section/SectionFloatingActions";
import useSectionActions from "../../hooks/useSectionActions";
import useSectionItems from "../../hooks/useSectionItems";
import { sectionQueries } from "../../query/sections.query";

export default function Section() {
  const { id } = useParams<{ id: string }>();
  const sectionId = id && /^\d+$/.test(id) ? Number(id) : null;
  const query = useQuery({
    ...sectionQueries.all(sectionId ?? undefined),
    enabled: sectionId !== null,
    refetchInterval: 30_000,
  });
  const section = query.data?.data?.[0];
  const {
    items,
    orderedItems,
    draggedItemId,
    setDraggedItemId,
    handleDrop,
  } = useSectionItems(sectionId, section?.items);
  const {
    colors,
    sectionExpiresAt,
    openForm,
    confirmDelete,
    openCards,
  } = useSectionActions(sectionId, section, items);



  return (
    <Container size="xl" w="100%">
      <PageHeader
        uppercase={false}
        title={
          query.isPending ? (
            <Loader type="dots" color={colors.accPrimary} />
          ) : (
            <Flex align="center" gap="xs">
              {section?.title}
              {sectionExpiresAt && <ExpiryTimer expiresAt={sectionExpiresAt} />}
            </Flex>
          )
        }
      />
      <SectionContent
        isPending={query.isPending}
        isError={query.isError}
        onRetry={() => void query.refetch()}
        items={items}
        orderedItems={orderedItems}
        draggedItemId={draggedItemId}
        onEdit={openForm}
        onDelete={confirmDelete}
        onDragStart={setDraggedItemId}
        onDragEnd={() => setDraggedItemId(null)}
        onDrop={handleDrop}
        backgroundColor={colors.bgBase}
      />
      {section && (
        <SectionFloatingActions
          onManageCards={openCards}
          onAddItem={() => openForm()}
        />
      )}
    </Container>
  );
}
